import { IResponse } from '../types'
import { NextFunction, Request } from 'express'

interface IRouteAction {
  (req: Request, res: IResponse, next?: NextFunction): Promise<any>
}

export const asyncAction = (action: IRouteAction) => (req: Request, res: IResponse, next: NextFunction) =>
  Promise.resolve(action(req, res, next)).catch(next)
