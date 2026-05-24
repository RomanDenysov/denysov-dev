import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"

export default function CalEmbed() {
  useEffect(() => {
    void getCalApi().then((cal) => {
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })
  }, [])

  return (
    <Cal
      calLink="denysov/60min"
      style={{ width: "100%" }}
      config={{ layout: "month_view" }}
    />
  )
}