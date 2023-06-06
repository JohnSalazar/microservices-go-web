// import configDev from '../config/config-dev.json' assert { type: 'json' }
// import configProd from '../config/config-prod.json' assert { type: 'json' }

// export default function ConfigService() {
//   return process.env.NODE_ENV === 'production' ? configProd : configDev
// }

import { ConfigType } from '@/types/config-type'

import configDev from '../config/config-dev.json'
import configProd from '../config/config-prod.json'

let _config

export default function ConfigService() {
  if (!_config) {
    if (process.env.NODE_ENV === 'production') {
      _config = configProd

      _config.passwordPermissionEndPoint =
        process.env.PASSWORDPERMISSIONENDPOINT
    } else {
      _config = configDev
    }
  }

  function GetConfig(): ConfigType {
    return _config
  }

  // function UpdateConfig(config: ConfigType) {
  //   _config = config
  // }

  return { GetConfig }
}
