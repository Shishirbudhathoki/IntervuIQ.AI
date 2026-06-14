import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useState } from 'react';
import { motion } from 'motion/react';
import { ServerURL } from '../App';
import { setUserData } from '../redux/userSlice';

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  // const dispatch = useDispatch();
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "Rs. 0",
      credits: "100",
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limites History Tracking"
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Stater Pack",
      price: "Rs. 99",
      credits: "150",
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "Rs. 299",
      credits: "650",
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing"
      ],
      badge: "Best Value",
    },
  ];

  // const handlePayment = async (plan) => {
  //   // onClick={(e) => {e.stopPropagation();
  //   //             if (!isSelected) {
  //   //               setSelectedPlan(plan.id);
  //   //             } else {
  //   //               handlePayment(plan);
  //   //             }
  //   //           }} yo add garnu parcha button ma
  //   try {
  //     setLoadingPlan(plan.id);
  //     const amount =
  //       plan.id === "basic" ? 99 :
  //         plan.id === "pro" ? 299 : 0;

  //     const response = await axios.post(ServerURL + "/api/payment/order", {
  //       planId: plan.id,
  //       amount,
  //       credits: plan.credits,
  //     }, {
  //       withCredentials: true,
  //       amount,
  //     });
  //     console.log("Order created:", response.data);
  //     const options = {
  //       key: import.meta.env.VITE_KHALTIPAY_KEY_ID,
  //       amount: response.data.amount,
  //       currency: "MRP",
  //       name: "IntervuIQ.AI",
  //       description: `Payment for ${plan.name} - ${plan.credits} Credits`,
  //       order_id: response.data.id,

  //       handler: async function (response) {
  //         console.log("Payment successful:", response);
  //         const verifpay = await axios.post(ServerURL + "/api/payment/verify", response, {
  //           withCredentials: true,
  //         });
  //         dispatch(setUserData(verifpay.data.user));
  //         alert("Payment successful! Your credits have been added.");
  //         navigate("/");
  //       },
  //       theme: {
  //         color: "#10B981",
  //       },
  //     };

  //     const khalti = new window.KhaltiCheckout(options);
  //     khalti.open();
  //     setLoadingPlan(null);

  //   } catch (error) {
  //     console.error("Payment failed:", error);
  //   }
  // }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 to-emerald-50 py-14 px-6">
      <div className="max-w-6xl mx-auto mb-10 flex items-start gap-4">
        <button onClick={() => navigate("/")} className="mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition">
          <FaArrowLeft className="text-gray-600 " />
        </button>

        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-gray-800 ">
            Choose Your Plan
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-6 transition-all duration-300 border ${isSelected ? "border-emerald-500 shadow-2xl bg-white" : "border-gray-200 bg-white shadow-md"} ${plan.default ? "cursor-default" : "cursor-pointer"}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full">
                  Default
                </div>
              )}

              {/* Plane Name */}
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h3>

              {/* Price */}
              <div className='mt-4'>
                <span className="text-3xl font-bold text-emerald-600">
                  {plan.price}
                </span>
                <p className='text-gray-500 mt-1'>
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default && <button
                disabled={loadingPlan === plan.id}
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition 
                ${isSelected ? "bg-emerald-600 hover:opacity-90 text-white" : "bg-gray-100 text-gray-700 hover:bg-emerald-50"}`}>
                {isSelected ? "Proceed to pay" : "Select plan"}
              </button>
              }
            </motion.div>
          )
        })
        }
      </div>
    </div >
  )
}

export default Pricing