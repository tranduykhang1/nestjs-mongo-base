export class SendMailDto {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
