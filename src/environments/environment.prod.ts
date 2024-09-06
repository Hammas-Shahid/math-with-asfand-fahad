import {EncryptionService} from "../app/services/encryption.service";

export const environment = {
  production: true,
  secretKeyPart1: 'prod-part-key'
};

const encryptionService = new EncryptionService();

export const routes: { [key: string]: string } = {
  'metric-dimension': encryptionService.close('qwerty9211'),
  'vector-calculator': encryptionService.close('U2FsdGVkX1/QAAw7PW+X4idaPOPQopgiWzbctO3F7jo='),
  'information-system': encryptionService.close('asdf420'),
  'direct-distance': encryptionService.close('kholo2'),
  'comparison-analysis': encryptionService.close('asdf9211')
};
