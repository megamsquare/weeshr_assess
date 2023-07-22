import { Response, NextFunction } from "express";
import status_code from "http-status";
import Err from "../dto/error_dto";
import AuthService from "../services/auth.service";
import { UserRequest } from "../dto/obj/user.dto";
import { AccessTokenCheck } from "../dto/obj/auth.dto";

function verifyToken(req: UserRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  try {
    const accessInfo: AccessTokenCheck = {
      header: header,
    };
    const payload = AuthService.validateUserAccessToken(accessInfo);
    if (payload instanceof Error) {
      res.status(status_code.UNAUTHORIZED).json({ message: payload.message });
      return;
    }

    req.user = {
      userId: payload.userId as string,
      role: payload.roles as string[],
    };

    next();
  } catch (error) {
    res
      .status(status_code.UNAUTHORIZED)
      .json({ message: Err.Unauthentication });
    return;
  }
}

function verifyPermission(roles: string[] = []) {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const user_role = req.user?.role || [];
    // console.log(`route roles are ${roles} and user roles ${req.user?.role}`)
    const has_permission = roles.some((role) => user_role.includes(role));
    if (!has_permission) {
      res
        .status(status_code.UNAUTHORIZED)
        .json({ message: Err.UnauthorizedRoute });
      return;
    }
    next();
  };
}

const AuthMiddleware = {
  verifyToken,
  verifyPermission,
};

export default AuthMiddleware;
