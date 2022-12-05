export class SendCodeForChangeDto {
  oldEmail: string;

  newEmail: string;
  codeOld: string;
  codeNew: string;
  emailConfirmed: boolean;
}
