import axios from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DadataConfig } from 'src/config/dadata.config';
import { DadataDto } from './dto/dadata.dto';

const dadataApi = axios.create({
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  method: 'POST',
  headers: {
    Authorization: DadataConfig.apiToken,
  },
});

@Injectable()
export class DadataService {
  async getCityCodeByKladr(kladr_code: string): Promise<any[]> {
    const response = await dadataApi({
      url: 'findById/delivery',
      data: {
        query: kladr_code,
      },
    });

    return response.data.suggestions || [];
  }

  async getCityCodeNumberByKladr(
    kladr_code?: string | number,
  ): Promise<number> {
    if (!kladr_code) {
      throw new BadRequestException('KLADR_CODE_IS_MISSING');
    }
    const response = await dadataApi({
      url: 'findById/delivery',
      data: {
        query: kladr_code,
      },
    });
    if (!response.data.suggestions?.length) {
      throw new BadRequestException('NO_RESULT');
    }
    return +response.data.suggestions[0].data.cdek_id;
  }

  async getPostalCode(value: string): Promise<any[]> {
    const response = await dadataApi({
      url: 'suggest/postal_office',
      data: {
        query: value,
      },
    });

    return response.data.suggestions || [];
  }

  async getCountry(value: string): Promise<any[]> {
    const response = await dadataApi({
      url: 'suggest/address',
      data: {
        query: value,
        count: 20,
        from_bound: { value: 'country' },
        to_bound: { value: 'country' },
        locations: [
          {
            country_iso_code: '*',
          },
        ],
      },
    });

    return response.data.suggestions || [];
  }

  async getCity(query: DadataDto): Promise<any[]> {
    const response = await dadataApi({
      url: 'suggest/address',
      data: {
        query: query.value,
        count: 20,
        from_bound: { value: 'city' },
        to_bound: { value: 'settlement' },
        locations: query.locations,
      },
    });

    return response.data.suggestions || [];
  }

  async getStreet(query: DadataDto): Promise<any[]> {
    const response = await dadataApi({
      url: 'suggest/address',
      data: {
        query: query.value,
        count: 20,
        from_bound: { value: 'street' },
        to_bound: { value: 'street' },
        locations: query.locations,
      },
    });

    return response.data.suggestions || [];
  }

  async getHouse(query: DadataDto): Promise<any[]> {
    const response = await dadataApi({
      url: 'suggest/address',
      data: {
        query: query.value,
        count: 20,
        from_bound: { value: 'house' },
        to_bound: { value: 'house' },
        locations: query.locations,
      },
    });
    return response.data.suggestions || [];
  }
}
