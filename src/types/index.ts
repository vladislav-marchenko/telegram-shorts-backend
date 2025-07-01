import { Request } from 'express'
import { UserDocument } from 'src/schemas/user.schema'

export interface AuthRequest extends Request {
  user: UserDocument
}
