import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { SdekConfig } from 'src/config/sdek.config';

import { СdekPdfOrBarcodeDto } from './dto/сdek-pdf-barcode.dto';
import {
  CdekTariffListDto,
  TariffCodesType,
  TariffType,
} from './dto/cdek-tarifflist';
import { CdekTariffCodeDto, CdekTariffByCode } from './dto/cdek-tariff-code';
import {
  CdekCreateOrderDto,
  CdekOrderResponseDto,
  CdekUpdateOrderDto,
} from './dto/cdek-order';
import { CdekCourierDto } from './dto/cdek.courier.dto';
import { DadataService } from '../dadata/dadata.service';

// тестовая среда имеет api.edu в url
// если вдруг будут ошибки в запросах МБ это поможет 'Content-Type': 'application/json',

export const axiosCdek = axios.create({
  baseURL: 'https://api.cdek.ru/v2',
});
export const axiosTestCdek = axios.create({
  baseURL: 'https://api.edu.cdek.ru/v2',
});

@Injectable()
export class SdekService {
  constructor(private dadataService: DadataService) {}

  async authInSdek(): Promise<string> {
    const result = await axiosCdek({
      method: 'POST',
      url: 'oauth/token',
      params: {
        grant_type: 'client_credentials',
        client_id: SdekConfig.clientID,
        client_secret: SdekConfig.clientSecret,
      },
    });
    return 'Bearer ' + result.data.access_token;
  }

  async getCityCodeByKladr(kladr_code: string) {
    const suggestions = await this.dadataService.getCityCodeByKladr(kladr_code);

    if (!suggestions.length) return [];
    const result = await axiosCdek({
      url: `deliverypoints`,
      params: {
        city_code: suggestions[0].data.cdek_id,
      },
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    return result.data;
  }

  async getTariffList(body: CdekTariffListDto): Promise<TariffType[]> {
    try {
      if (!body.packages || !body.packages.length) {
        body.packages = Array.from(Array(body.amount || 1)).map(() => ({
          weight: SdekConfig.weight,
          length: SdekConfig.length,
          width: SdekConfig.width,
          height: SdekConfig.height,
        }));
      }

      if (!body.to_location.code) {
        body.to_location.code =
          await this.dadataService.getCityCodeNumberByKladr(
            body.to_location.kladr_code,
          );
      }

      const result: TariffCodesType = await axiosCdek({
        method: 'POST',
        url: 'calculator/tarifflist',
        data: {
          from_location: {
            city: SdekConfig.from_location.city,
            adress: SdekConfig.from_location.address,
            code: SdekConfig.from_location.code,
          },
          type: 1,
          date: body.date,
          lang: body.lang,
          to_location: body.to_location,
          packages: body.packages,
        },
        headers: {
          Authorization: await this.authInSdek(),
        },
      });
      if (result.data.errors) {
        throw new Error(result.data.errors);
      }
      const exeption = [136, 137, 233, 234];
      return result.data.tariff_codes.filter((item) =>
        exeption.includes(item.tariff_code),
      );
    } catch (error) {
      console.log(error.response);
      throw new BadRequestException(error);
    }
  }

  async сalculationByTariffCode(
    body: CdekTariffCodeDto,
  ): Promise<CdekTariffByCode> {
    if (!body.packages || !body.packages.length) {
      body.packages = Array.from(Array(body.amount || 1)).map(() => ({
        weight: SdekConfig.weight,
        length: SdekConfig.length,
        width: SdekConfig.width,
        height: SdekConfig.height,
      }));
    }

    try {
      const result: { data: CdekTariffByCode } = await axiosCdek({
        method: 'POST',
        url: '/calculator/tariff',
        data: {
          from_location: {
            city: SdekConfig.from_location.city,
            adress: SdekConfig.from_location.address,
            code: SdekConfig.from_location.code,
          },
          type: 1,
          date: body.date,
          tariff_code: body.tariff_code,
          to_location: body.to_location,
          packages: body.packages,
        },
        headers: {
          Authorization: await this.authInSdek(),
        },
      });
      if (result.data.errors) {
        throw new Error(result.data.errors);
      }
      return result.data;
    } catch (error) {
      console.log('ошибка калькулирования');
      throw new BadRequestException('ошибка калькулирования');
    }
  }

  async createOrder(body: CdekCreateOrderDto): Promise<CdekOrderResponseDto> {
    try {
      const result: AxiosResponse<CdekOrderResponseDto> = await axiosTestCdek({
        method: 'POST',
        url: '/orders',
        headers: {
          Authorization: await this.authInSdek(),
        },
        data: {
          from_location: {
            city: SdekConfig.from_location.city,
            address: SdekConfig.from_location.address,
            code: SdekConfig.from_location.code,
          },
          type: 1,
          number: body.number,
          tariff_code: body.tariff_code,
          comment: body.comment,
          shipment_point: body.shipment_point,
          delivery_point: body.delivery_point,
          recipient: body.recipient,
          to_location: body.to_location,
          packages: body.packages,
        },
      });

      result.data.requests.forEach((item) => {
        if (item.errors?.length) {
          throw new InternalServerErrorException('В заказе ошибка');
        }
      });
      return result.data;
    } catch (error) {
      console.log(error.response?.data?.requests?.[0]?.errors);

      throw new Error('Ошибка создания заказа в сдэк');
    }
  }
  // getOrder возращает номер заказа - cdek_number - очень полезная штука
  async getOrder(id: string) {
    const result = await axiosTestCdek({
      method: 'GET',
      url: `/orders/${id}`,
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    return result.data;
  }

  async editOrder(body: CdekUpdateOrderDto): Promise<CdekOrderResponseDto> {
    const result: { data: CdekOrderResponseDto } = await axiosTestCdek({
      method: 'PATCH',
      url: '/orders',
      headers: {
        Authorization: await this.authInSdek(),
      },
      data: {
        // from_location: {
        //   adress: body.from_location?.address, // только если надо
        // },
        uuid: body.uuid,
        cdek_number: body.cdek_number,
        number: body.number,
        tariff_code: body.tariff_code,
        comment: body.comment,
        shipment_point: body.shipment_point,
        delivery_point: body.delivery_point,
        recipient: body.recipient,
        to_location: body.to_location,
        packages: body.packages,
      },
    });
    return result.data;
  }

  async deleteOrder(id: string): Promise<CdekOrderResponseDto> {
    const result: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: `/orders/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: await this.authInSdek(),
      },
      data: {},
    });
    return result.data;
  }

  async createPdfReceipt(body: СdekPdfOrBarcodeDto): Promise<Buffer> {
    // Ссылка на файл с квитанцией к заказу/заказам доступна в течение 1 часа.
    const createRes: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: '/print/orders',
      method: 'POST',
      headers: {
        Authorization: await this.authInSdek(),
      },
      data: body,
    });
    const getRes: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: `/print/orders/${createRes.data.entity.uuid}`,
      method: 'GET',
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    const result = await axiosTestCdek({
      url: getRes.data.entity.url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    return result.data; // arrayBuffer будующего pdf
  }

  async createBarcode(body: СdekPdfOrBarcodeDto): Promise<Buffer> {
    // Ссылка на файл с ШК местом к заказу/заказам доступна в течение 1 часа.
    const createRes: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: '/print/barcodes',
      method: 'POST',
      headers: {
        Authorization: await this.authInSdek(),
      },
      data: body,
    });
    const getRes: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: `/print/barcodes/${createRes.data.entity.uuid}`,
      method: 'GET',
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    const result = await axiosTestCdek({
      url: getRes.data.entity.url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    return result.data; // arrayBuffer будующего Штрих кода pdf
  }

  async createCourier(body: CdekCourierDto) {
    const createRes: { data: CdekOrderResponseDto } = await axiosTestCdek({
      url: '/intakes',
      method: 'POST',
      data: {
        cdek_number: body.cdek_number,
        intake_date: body.intake_date,
        intake_time_from: body.intake_time_from,
        intake_time_to: body.intake_time_to,
        comment: body.comment,
        need_call: body.need_call,
      },
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    const result = await axiosTestCdek({
      url: `intakes/${createRes.data.entity.uuid}`,
      method: 'GET',
      headers: {
        Authorization: await this.authInSdek(),
      },
    });
    return result.data;
  }
}
