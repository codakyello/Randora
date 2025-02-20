import Script from "next/script";
import PaymentButton from "../_components/PaymentButton";

export default function Page() {
  return (
    <>
      <Script
        src="https://checkout.juicyway.com/pay.js"
        strategy="beforeInteractive"
      />

      <PaymentButton />
    </>
  );
}
// export default function Page() {
//   //   const [error, setError] = useState<string>("");
//   //   const [data, setData] = useState(null);

//   //   async function handlePayment() {
//   //     try {
//   //       const res = await fetch("https://api.spendjuice.com/customers", {
//   //         headers: {
//   //           authorization:
//   //             "live_Z2F0ZXdheS1saXZlOmQ2MDg2ZTBhLTgzMjQtNGNlMy1iOWEzLTQ5ODIzMWJiMjA0NTpmYWYwYTExNS0wZjg1LTQxZWItYjNkYy02MjlmOGJkMzJiZTA",
//   //         },
//   //       });

//   //       const data = await res.json();
//   //       if (!res.ok) throw new Error(data.message);

//   //       console.log(data);
//   //     } catch (err) {
//   //       if (err instanceof Error) {
//   //         setError(err.message);
//   //       }
//   //     }
//   //   }

//   return (
//     <
//   );
// }
