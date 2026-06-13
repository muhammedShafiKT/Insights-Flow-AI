import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import api from "../../../services/api"
import { loginSuccess } from "../../../features/auth.slice"

export default function useAuthCheck() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (!user) {
      api.get("/auth/getme")
        .then((res) => dispatch(loginSuccess(res.data.user)))
        .catch(() => {})
    }
  }, [user, dispatch])
}