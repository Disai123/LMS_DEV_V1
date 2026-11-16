import { stage01Labs } from './stage01'
import { stage02Labs } from './stage02'
import { stage02Assignment } from './stage02Assignment'
import { stageSdlcLabs } from './stageSdlc'
import { stageDevDeployLabs } from './stageDevDeploy'
import { stageCapstoneLabs } from './stageCapstone'
import { ASSIGNMENTS } from './assignments'

export const EXERCISES = {
  ...stage01Labs,
  ...stage02Labs,
  ...stage02Assignment,
  ...stageSdlcLabs,
  ...stageDevDeployLabs,
  ...stageCapstoneLabs,
  ...ASSIGNMENTS,
}
