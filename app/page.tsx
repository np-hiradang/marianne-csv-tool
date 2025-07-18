"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input, Modal, Button } from "@/components";
import iconv from "iconv-lite";

interface FormData {
  shopTransactionId: string;
  shopOrderDate: string;
  companyName: string;
  department: string;
  customerName: string;
  buyerId: string;
  zip: string;
  address: string;
  tel: string;
  email: string;
  deliveryCompanyName: string;
  deliveryDepartment: string;
  deliveryCustomerName: string;
  deliveryCustomerNameKana: string;
  deliveryZip: string;
  deliveryAddress: string;
  deliveryTel: string;
  settlementType: string;
  fax: string;
  remindType: string;
  optionalField: string;
  billedAmount: string;
  goodsName: string;
  goodsPrice: string;
  quantity: string;
}

export default function Home() {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [csvLineCount, setCsvLineCount] = useState<number>(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      shopTransactionId: "test_20250718_001",
      shopOrderDate: "2025/07/18",
      companyName: "株式会社テスト",
      department: "営業部",
      customerName: "田中太郎",
      buyerId: "test_0001",
      zip: "100-0001",
      address: "東京都千代田区千代田1-1",
      tel: "03-1234-5678",
      settlementType: "2",
      fax: "03-1234-5679",
      remindType: "メール",
      billedAmount: "1000",
      goodsName: "商品",
      goodsPrice: "1000",
    },
  });

  const exportToCSV = (data: FormData) => {
    // Define CSV headers in Japanese
    const headers = [
      "加盟店取引ID",
      "加盟店取引受注日",
      "企業名",
      "部署名",
      "担当者名",
      "購入企業ID",
      "郵便番号",
      "住所",
      "電話番号",
      "メールアドレス",
      "配送先企業名",
      "配送先部署名",
      "配送先担当者名",
      "配送先担当者名（カナ）",
      "配送先郵便番号",
      "配送先住所",
      "配送先電話番号",
      "決済種別",
      "FAX番号",
      "リマインド種別",
      "未使用項目",
      "請求金額",
      "商品名",
      "商品価格",
      "数量",
    ];

    // Generate multiple rows based on csvLineCount
    const csvRows = [];

    for (let i = 1; i <= csvLineCount; i++) {
      // Create incremented shopTransactionId
      const incrementedId = `${data.shopTransactionId}_${String(i).padStart(
        4,
        "0"
      )}`;

      const row = [
        incrementedId, // Incremented shopTransactionId
        data.shopOrderDate,
        data.companyName,
        data.department,
        data.customerName,
        data.buyerId,
        data.zip,
        data.address,
        data.tel,
        data.email,
        data.deliveryCompanyName,
        data.deliveryDepartment,
        data.deliveryCustomerName,
        data.deliveryCustomerNameKana,
        data.deliveryZip,
        data.deliveryAddress,
        data.deliveryTel,
        data.settlementType,
        data.fax,
        data.remindType,
        data.optionalField,
        data.billedAmount,
        data.goodsName,
        data.goodsPrice,
        data.quantity,
      ];

      csvRows.push(row.join(","));
    }

    // Create CSV content with headers and all rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Convert to Shift_JIS encoding using iconv-lite
    const shiftJISBuffer = iconv.encode(csvContent, "shift_jis");
    const blob = new Blob([shiftJISBuffer], {
      type: "text/csv;charset=shift_jis;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `csv_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setIsPreviewModalOpen(true);
  };

  // useEffect to handle CSV line count changes
  useEffect(() => {
    console.log("CSV line count changed to:", csvLineCount);
  }, [csvLineCount]);

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="p-4 rounded mb-4 text-center font-bold text-4xl">
        CSV自動作成ツール
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        <Input
          label="加盟店取引ID (prefix)"
          placeholder="test_20250718_001"
          {...register("shopTransactionId", {
            required: "加盟店取引IDは必須です",
            minLength: { value: 3, message: "最低3文字必要です" },
          })}
          error={errors.shopTransactionId?.message}
        />
        <div className="text-sm">
          *:
          加盟店取引IDはUniqueである必要がありますので、Prefixだけを定義して、自動的にIncrementさせる
        </div>

        <Input
          label="加盟店取引受注日"
          placeholder="2025/07/18"
          {...register("shopOrderDate", {
            required: "加盟店取引受注日は必須です",
          })}
          error={errors.shopOrderDate?.message}
        />
        <Input
          label="企業名"
          placeholder="株式会社テスト"
          {...register("companyName")}
          error={errors.companyName?.message}
        />
        <Input
          label="部署名"
          placeholder="営業部"
          {...register("department")}
          error={errors.department?.message}
        />
        <Input
          label="担当者名"
          placeholder="田中太郎"
          {...register("customerName")}
          error={errors.customerName?.message}
        />
        <Input
          label="購入企業ID"
          placeholder="test_0001"
          {...register("buyerId")}
          error={errors.buyerId?.message}
        />
        <Input
          label="郵便番号"
          placeholder="100-0001"
          {...register("zip")}
          error={errors.zip?.message}
        />
        <Input
          label="住所"
          placeholder="東京都千代田区千代田1-1"
          {...register("address")}
          error={errors.address?.message}
        />
        <Input
          label="電話番号"
          placeholder="03-1234-5678"
          {...register("tel")}
          error={errors.tel?.message}
        />
        <Input
          label="メールアドレス"
          placeholder="test@example.com"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="配送先企業名"
          placeholder="株式会社配送先"
          {...register("deliveryCompanyName")}
          error={errors.deliveryCompanyName?.message}
        />
        <Input
          label="配送先部署名"
          placeholder="配送部"
          {...register("deliveryDepartment")}
          error={errors.deliveryDepartment?.message}
        />
        <Input
          label="配送先担当者名"
          placeholder="配送田中"
          {...register("deliveryCustomerName")}
          error={errors.deliveryCustomerName?.message}
        />
        <Input
          label="配送先担当者名（カナ）"
          placeholder="ハイソウタナカ"
          {...register("deliveryCustomerNameKana")}
          error={errors.deliveryCustomerNameKana?.message}
        />
        <Input
          label="配送先郵便番号"
          placeholder="100-0001"
          {...register("deliveryZip")}
          error={errors.deliveryZip?.message}
        />
        <Input
          label="配送先住所"
          placeholder="東京都中央区日本橋1-1"
          {...register("deliveryAddress")}
          error={errors.deliveryAddress?.message}
        />
        <Input
          label="配送先電話番号"
          placeholder="03-9876-5432"
          {...register("deliveryTel")}
          error={errors.deliveryTel?.message}
        />
        <Input
          label="決済種別"
          placeholder="2"
          {...register("settlementType")}
          error={errors.settlementType?.message}
        />
        <Input
          label="FAX番号"
          placeholder="03-1234-5679"
          {...register("fax")}
          error={errors.fax?.message}
        />
        <Input
          label="リマインド種別"
          placeholder="メール"
          {...register("remindType")}
          error={errors.remindType?.message}
        />
        <Input
          label="任意項目"
          placeholder="その他の情報"
          {...register("optionalField")}
          error={errors.optionalField?.message}
        />
        <Input
          label="請求金額"
          placeholder="10000"
          type="number"
          {...register("billedAmount", {})}
          error={errors.billedAmount?.message}
        />
        <Input
          label="商品名"
          placeholder="商品A"
          {...register("goodsName")}
          error={errors.goodsName?.message}
        />
        <Input
          label="商品価格"
          placeholder="5000"
          type="number"
          {...register("goodsPrice", {
            min: { value: 0, message: "0円以上で入力してください" },
          })}
          error={errors.goodsPrice?.message}
        />
        <Input
          label="数量"
          placeholder="2"
          type="number"
          {...register("quantity", {
            min: { value: 1, message: "1個以上で入力してください" },
          })}
          error={errors.quantity?.message}
        />

        <div className="p-4 rounded mb-4 text-left font-bold text-2xl">
          CSV File Setting
        </div>

        {/* CSV Line Count Input */}
        <div className="max-w-md mx-auto mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              CSV行数:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="1000"
                value={csvLineCount}
                onChange={(e) => setCsvLineCount(Number(e.target.value))}
                className="w-40 px-3 py-1 border border-gray-300 rounded text-center"
              />
              <span className="text-sm text-gray-500">行</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            生成するCSVファイルの行数を指定してください (1-1000行)
          </p>
        </div>

        <div>
          ・加盟店取引IDは自動的にIncrementさせて、他の項目は全て同じ値になります！
        </div>

        <Button type="submit" variant="primary" fullWidth>
          確認
        </Button>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="入力データ確認"
        size="xl"
      >
        {formData && (
          <div className="space-y-4">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>生成予定:</strong> {csvLineCount}行のCSVファイル
              </p>
              <p className="text-sm text-blue-600 mt-1">
                加盟店取引IDは自動的にインクリメントされます (_0001, _0002, ...)
              </p>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="min-w-max border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      行番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      加盟店取引ID
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      加盟店取引受注日
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      企業名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      部署名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      担当者名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      購入企業ID
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      郵便番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      住所
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      電話番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      メールアドレス
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先企業名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先部署名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先担当者名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先担当者名（カナ）
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先郵便番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先住所
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      配送先電話番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      決済種別
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      FAX番号
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      リマインド種別
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      未使用項目
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      請求金額
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      商品名
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      商品価格
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs whitespace-nowrap">
                      数量
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: csvLineCount }, (_, index) => {
                    const rowNumber = index + 1;
                    const incrementedId = `${
                      formData.shopTransactionId
                    }_${String(rowNumber).padStart(4, "0")}`;

                    return (
                      <tr
                        key={rowNumber}
                        className={rowNumber % 2 === 0 ? "bg-gray-50" : ""}
                      >
                        <td className="border border-gray-300 px-3 py-2 text-center font-medium text-xs">
                          {rowNumber}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 font-mono text-xs">
                          {incrementedId}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.shopOrderDate}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.companyName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.department}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.customerName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.buyerId}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.zip}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.address}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.tel}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.email}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryCompanyName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryDepartment}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryCustomerName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryCustomerNameKana}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryZip}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryAddress}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.deliveryTel}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.settlementType}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.fax}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.remindType}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.optionalField}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                          ¥{formData.billedAmount}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs">
                          {formData.goodsName}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs text-right">
                          ¥{formData.goodsPrice}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                          {formData.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => setIsPreviewModalOpen(false)}
                variant="secondary"
              >
                戻る
              </Button>
              <Button
                onClick={() => {
                  if (formData) {
                    exportToCSV(formData);
                    setIsPreviewModalOpen(false);
                  }
                }}
                variant="success"
              >
                CSV生成
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
