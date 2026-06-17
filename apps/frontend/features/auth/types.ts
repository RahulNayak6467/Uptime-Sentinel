import { FieldElement, FieldError, UseFormRegister } from "react-hook-form";
import { registerSchemaProps } from "./schemas/register-schema";
import { loginSchemaProps } from "./schemas/login-schema";

export type userRegister = UseFormRegister<registerSchemaProps>;

export type userLogin = UseFormRegister<loginSchemaProps>;
