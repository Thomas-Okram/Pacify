import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Formula 1",
    vp: 21.75,
    mrp: 2449,
    d25: 1837,
    d35: 1592,
    d42: 1419,
    d50: 1224,
    qty: 0,
  },
  {
    id: 2,
    name: "PPP - 200g",
    vp: 11.5,
    mrp: 1455,
    d25: 1091,
    d35: 946,
    d42: 843,
    d50: 728,
    qty: 0,
  },
  {
    id: 3,
    name: "PPP - 400g",
    vp: 22.5,
    mrp: 2792,
    d25: 2094,
    d35: 1815,
    d42: 1619,
    d50: 1396,
    qty: 0,
  },
  {
    id: 4,
    name: "ShakeMate",
    vp: 6.45,
    mrp: 733,
    d25: 550,
    d35: 476,
    d42: 425,
    d50: 366,
    qty: 0,
  },
  {
    id: 5,
    name: "Ocular Defence",
    vp: 19.25,
    mrp: 2166,
    d25: 1624,
    d35: 1408,
    d42: 1257,
    d50: 1083,
    qty: 0,
  },
  {
    id: 6,
    name: "Male Factor",
    vp: 34.75,
    mrp: 3832,
    d25: 2874,
    d35: 2491,
    d42: 2222,
    d50: 1916,
    qty: 0,
  },
  {
    id: 7,
    name: "Woman's Choice",
    vp: 12.45,
    mrp: 1399,
    d25: 1049,
    d35: 909,
    d42: 811,
    d50: 699,
    qty: 0,
  },
  {
    id: 8,
    name: "Brain Health",
    vp: 15.1,
    mrp: 1645,
    d25: 1234,
    d35: 1070,
    d42: 954,
    d50: 823,
    qty: 0,
  },
  {
    id: 9,
    name: "Cleanser",
    vp: 10.4,
    mrp: 1165,
    d25: 874,
    d35: 756,
    d42: 676,
    d50: 583,
    qty: 0,
  },
  {
    id: 10,
    name: "Toner",
    vp: 11.8,
    mrp: 1322,
    d25: 991,
    d35: 860,
    d42: 767,
    d50: 661,
    qty: 0,
  },
  {
    id: 11,
    name: "Serum",
    vp: 27.05,
    mrp: 3022,
    d25: 2266,
    d35: 1964,
    d42: 1753,
    d50: 1511,
    qty: 0,
  },
  {
    id: 12,
    name: "Moisturizer",
    vp: 13.15,
    mrp: 1473,
    d25: 1105,
    d35: 956,
    d42: 854,
    d50: 737,
    qty: 0,
  },
  {
    id: 13,
    name: "Skin Booster",
    vp: 38.65,
    mrp: 4394,
    d25: 3295,
    d35: 2856,
    d42: 2548,
    d50: 2197,
    qty: 0,
  },
  {
    id: 14,
    name: "Skin Booster Orange",
    vp: 38.65,
    mrp: 4266,
    d25: 3199,
    d35: 2773,
    d42: 2474,
    d50: 2133,
    qty: 0,
  },
  {
    id: 15,
    name: "Immune Health",
    vp: 15.8,
    mrp: 1717,
    d25: 1288,
    d35: 1099,
    d42: 996,
    d50: 859,
    qty: 0,
  },
  {
    id: 16,
    name: "Afresh",
    vp: 7.8,
    mrp: 913,
    d25: 685,
    d35: 593,
    d42: 529,
    d50: 457,
    qty: 0,
  },
  {
    id: 17,
    name: "Afresh Tulsi",
    vp: 7.8,
    mrp: 913,
    d25: 685,
    d35: 593,
    d42: 529,
    d50: 457,
    qty: 0,
  },
  {
    id: 18,
    name: "24 Hydrate",
    vp: 14.05,
    mrp: 1839,
    d25: 1379,
    d35: 1195,
    d42: 1067,
    d50: 920,
    qty: 0,
  },
  {
    id: 19,
    name: "24 Rebuild",
    vp: 24.7,
    mrp: 2940,
    d25: 2205,
    d35: 1911,
    d42: 1705,
    d50: 1470,
    qty: 0,
  },
  {
    id: 20,
    name: "DinoShake",
    vp: 9.6,
    mrp: 1252,
    d25: 939,
    d35: 813,
    d42: 726,
    d50: 626,
    qty: 0,
  },
  {
    id: 21,
    name: "Activated Fiber",
    vp: 15.75,
    mrp: 1839,
    d25: 1379,
    d35: 1195,
    d42: 1067,
    d50: 920,
    qty: 0,
  },
  {
    id: 22,
    name: "Active Fiber Complex",
    vp: 22.95,
    mrp: 2876,
    d25: 2157,
    d35: 1870,
    d42: 1668,
    d50: 1438,
    qty: 0,
  },
  {
    id: 23,
    name: "Aloe Plus",
    vp: 9.4,
    mrp: 1190,
    d25: 893,
    d35: 774,
    d42: 690,
    d50: 595,
    qty: 0,
  },
  {
    id: 24,
    name: "Aloe Concentrate",
    vp: 24.95,
    mrp: 3030,
    d25: 2272,
    d35: 1970,
    d42: 1757,
    d50: 1515,
    qty: 0,
  },
  {
    id: 25,
    name: "Simply Probiotic",
    vp: 21.95,
    mrp: 2482,
    d25: 1861,
    d35: 1614,
    d42: 1439,
    d50: 1241,
    qty: 0,
  },
  {
    id: 26,
    name: "Triphala",
    vp: 11.25,
    mrp: 1224,
    d25: 918,
    d35: 796,
    d42: 710,
    d50: 612,
    qty: 0,
  },
  {
    id: 27,
    name: "Calcium",
    vp: 10.25,
    mrp: 1352,
    d25: 1014,
    d35: 879,
    d42: 783,
    d50: 676,
    qty: 0,
  },
  {
    id: 28,
    name: "Joint Support",
    vp: 20.9,
    mrp: 2759,
    d25: 2069,
    d35: 1793,
    d42: 1599,
    d50: 1380,
    qty: 0,
  },
  {
    id: 29,
    name: "Niteworks",
    vp: 75,
    mrp: 8010,
    d25: 6007,
    d35: 5207,
    d42: 4646,
    d50: 4005,
    qty: 0,
  },
  {
    id: 30,
    name: "Lifeline",
    vp: 25.75,
    mrp: 2990,
    d25: 2242,
    d35: 1944,
    d42: 1724,
    d50: 1495,
    qty: 0,
  },
  {
    id: 30,
    name: "Lifeline",
    vp: 25.75,
    mrp: 2990,
    d25: 2242,
    d35: 1944,
    d42: 1724,
    d50: 1495,
    qty: 0,
  },
  {
    id: 31,
    name: "Beta Heart",
    vp: 19.55,
    mrp: 2520,
    d25: 1890,
    d35: 1638,
    d42: 1462,
    d50: 1260,
    qty: 0,
  },
  {
    id: 32,
    name: "Multivitamin",
    vp: 19.95,
    mrp: 2252,
    d25: 1689,
    d35: 1464,
    d42: 1306,
    d50: 1126,
    qty: 0,
  },
  {
    id: 33,
    name: "Cell Activator",
    vp: 21.95,
    mrp: 2489,
    d25: 1867,
    d35: 1618,
    d42: 1443,
    d50: 1245,
    qty: 0,
  },
  {
    id: 34,
    name: "Cell-U-Loss",
    vp: 15.75,
    mrp: 1916,
    d25: 1437,
    d35: 1251,
    d42: 1111,
    d50: 958,
    qty: 0,
  },
  {
    id: 35,
    name: "Herbal Control",
    vp: 32.95,
    mrp: 3858,
    d25: 2894,
    d35: 2512,
    d42: 2238,
    d50: 1929,
    qty: 0,
  },
];

const CalculatorPage = () => {
  const [productList, setProductList] = useState(products);
  const [discount, setDiscount] = useState(0); // Discount percentage
  const [invoice, setInvoice] = useState(null);

  const handleQtyChange = (index, action) => {
    const updatedProducts = [...productList];
    if (action === "increase") updatedProducts[index].qty += 1;
    if (action === "decrease" && updatedProducts[index].qty > 0)
      updatedProducts[index].qty -= 1;
    setProductList(updatedProducts);
  };

  const calculateTotals = () => {
    const totalVP = productList.reduce(
      (acc, item) => acc + item.vp * item.qty,
      0
    );

    const totalPrice = productList.reduce((acc, item) => {
      let price;
      if (discount === 25) price = item.d25;
      else if (discount === 35) price = item.d35;
      else if (discount === 42) price = item.d42;
      else if (discount === 50) price = item.d50;
      else price = item.mrp;
      return acc + price * item.qty;
    }, 0);

    const totalQty = productList.reduce((acc, item) => acc + item.qty, 0);

    return {
      totalVP: parseFloat(totalVP.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      totalQty,
    };
  };

  const totals = calculateTotals();

  const generateInvoice = () => {
    const invoiceData = productList.filter((item) => item.qty > 0);
    setInvoice(invoiceData);
  };

  const clearAll = () => {
    const clearedProducts = productList.map((item) => ({
      ...item,
      qty: 0,
    }));
    setProductList(clearedProducts);
    setInvoice(null);
  };

  return (
    <div
      className="w-full min-h-screen text-white"
      style={{
        backgroundImage:
          "url('/public/asset/hero/pexels-olia-danilevich-8145335.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Add padding to prevent content overlap */}
      <div className="bg-black bg-opacity-70 w-full min-h-screen py-20 px-6">
        <div className="container mx-auto w-full lg:w-5/6">
          <h1 className="text-4xl font-bold text-center mb-6 text-green-400">
            Calculator
          </h1>

          {/* Discount Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Discount</h2>
            <div className="flex justify-evenly flex-wrap gap-2">
              {[0, 25, 35, 42, 50].map((value) => (
                <button
                  key={value}
                  className={`px-6 py-2 rounded-md ${
                    discount === value
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setDiscount(value)}
                >
                  {value === 0 ? "MRP" : `${value}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Result</h2>
            <div className="flex justify-between text-lg">
              <div>Total VP: {totals.totalVP}</div>
              <div>Total Price: ₹{totals.totalPrice}</div>
              <div>Total Quantity: {totals.totalQty}</div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>
            <div className="flex flex-col gap-4">
              {productList.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-700 p-6 rounded-lg shadow-md justify-between"
                >
                  <div>
                    <div className="font-bold text-lg">{product.name}</div>
                    <div className="text-sm mt-2">VP: {product.vp}</div>
                    <div className="text-sm">
                      Price: ₹
                      {discount === 25
                        ? product.d25
                        : discount === 35
                        ? product.d35
                        : discount === 42
                        ? product.d42
                        : discount === 50
                        ? product.d50
                        : product.mrp}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQtyChange(index, "decrease")}
                      className="bg-red-500 px-4 py-2 rounded text-white"
                    >
                      -
                    </button>
                    <div className="text-xl font-semibold">{product.qty}</div>
                    <button
                      onClick={() => handleQtyChange(index, "increase")}
                      className="bg-green-500 px-4 py-2 rounded text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6 gap-4">
            <button
              className="bg-red-500 px-4 py-2 rounded-md text-white"
              onClick={clearAll}
            >
              Clear All
            </button>
            <button
              className="bg-blue-500 px-4 py-2 rounded-md text-white"
              onClick={generateInvoice}
            >
              Generate Invoice
            </button>
          </div>

          {/* Invoice Section */}
          {invoice && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Invoice
              </h2>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">VP</th>
                    <th className="py-2 px-4 border-b">Qty</th>
                    <th className="py-2 px-4 border-b">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b">{item.vp}</td>
                      <td className="py-2 px-4 border-b">{item.qty}</td>
                      <td className="py-2 px-4 border-b">
                        ₹
                        {(
                          (discount === 25
                            ? item.d25
                            : discount === 35
                            ? item.d35
                            : discount === 42
                            ? item.d42
                            : discount === 50
                            ? item.d50
                            : item.mrp) * item.qty
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
