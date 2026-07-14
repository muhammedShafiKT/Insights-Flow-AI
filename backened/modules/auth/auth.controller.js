
import authService from "./auth.service.js";
import { asyncWrapper } from "../../middlewares/asyncWrapper.js";

export const register = asyncWrapper(async (req, res) => {
  const result = await authService.register(req, res);
  res.status(201).json(result);
});

export const login = asyncWrapper(async (req, res) => {
  const result = await authService.login(req, res);
  res.status(200).json(result);
});

export const verifyotp = asyncWrapper(async (req, res) => {
  const result = await authService.verifyotp(req, res);
  res.status(200).json(result);
});

export const refreshaccess = asyncWrapper(async (req, res) => {
  const result = await authService.refreshlogin(req, res);
  res.status(200).json(result);
});

export const getme = asyncWrapper(async (req, res) => {
  const result = await authService.getme(req, res);
  res.status(200).json(result);
});

export const updateName = asyncWrapper(async (req, res) => {
    const result = await authService.updateName(req, res)
    res.status(200).json(result)
})

export const logout = asyncWrapper(async (req, res) => {
  const result = await authService.logout(req, res);
  res.status(200).json(result);
});

export const forgotpassword = asyncWrapper(async (req, res) => {
  const result = await authService.forgotpassword(req, res);
  res.status(200).json(result);
});

export const resetpassword = asyncWrapper(async (req, res) => {
  const result = await authService.resetpassword(req, res);
  res.status(200).json(result);
});

export const googleCallback = asyncWrapper(async (req, res) => {
  await authService.googleLogin(req, res);
  res.redirect(`${process.env.CLIENT_URL}/home`);
});