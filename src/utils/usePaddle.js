import { useEffect, useState } from "react";

export function usePaddle(){
  const [paddle, setPaddle] = useState(null);

    useEffect(() => {

    }, []);
  
    const pro_monthly = () => {
      // paddle?.Checkout.open({
      //   items: [{ priceId:'pri_01jc3v8nsajwdwjsddgycgbr7b', quantity: 1 }],
      // });
    };

    const pro_annually = () => {

      // paddle?.Checkout.open({
      //   items: [{ priceId:'pri_01jc3v87m4gh7tpgefempc15v9', quantity: 1 }],
      // });
    };

    return { pro_monthly, pro_annually }
  }