import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

type ImgProp = {
  src: string
  alt: string
}

const Img2 = (props: ImgProp) => {
  const [sSrc, setSsrc] = useState('')
  useEffect(() => {
    const fetchData = async (src: string) => await axios.get(src, { responseType: 'blob' }).then((res: AxiosResponse) => URL.createObjectURL(res.data))
    if (props.src) {
      fetchData(props.src).then(res => setSsrc(res))
    }
  }, [props.src])
  return (
    sSrc.length > 0 ? <img {...props} /> : <></>
  )
}

export default Img2