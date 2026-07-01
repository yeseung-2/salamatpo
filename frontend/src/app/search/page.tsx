export default function SearchPage() {
  return (
    <div className="p-5 max-w-md mx-auto pb-20">
      {/* 상단 뒤로가기 및 타이틀 */}
      <div className="flex items-center mb-6">
        <button className="mr-4 text-xl font-bold">←</button>
        <h1 className="text-xl font-bold">약 검색/입력</h1>
      </div>

      {/* 1. 약 이름으로 검색 (연우님 기획: 약품명 + 함량) */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3">약 이름으로 검색</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="예) Losartan 50mg"
            className="border border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:border-green-500"
          />
        </div>
        <p className="text-xs text-gray-500 flex items-center mt-1">
          <span className="text-blue-500 mr-1">ℹ️</span>
          정확한 검색을 위해 약품명과 함량을 함께 적어주세요.
        </p>
      </div>

      {/* 2. 처방전 촬영 (연우님 기획: OCR 파싱을 위한 진입점) */}
      <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-green-100 transition">
        <div>
          <h3 className="font-bold text-green-800 mb-1">처방전 촬영</h3>
          <p className="text-xs text-green-600">처방전을 찍으면 약 정보를 자동 인식합니다.</p>
        </div>
        <button className="bg-green-600 text-white p-3 rounded-full shadow-md text-xl">
          📷
        </button>
      </div>

      {/* 3. 병명으로 검색 (연우님 기획: 질병 기반 필터링) */}
      <div className="mb-8">
        <h2 className="text-base font-bold mb-3">병명으로 검색</h2>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:border-green-500 transition">고혈압</button>
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:border-green-500 transition">당뇨병</button>
          <button className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:border-green-500 transition">천식</button>
          <button className="border border-gray-300 border-dashed rounded-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">+ 직접 입력</button>
        </div>
      </div>

      {/* 4. 최근 검색 기록 */}
      <div>
        <h2 className="text-base font-bold mb-3">최근 검색</h2>
        <ul className="space-y-2">
          <li className="border border-gray-100 rounded-lg p-3 shadow-sm text-sm text-gray-700 flex justify-between items-center">
            <span>Losartan 50mg</span>
            <button className="text-gray-400 hover:text-red-500">✕</button>
          </li>
          <li className="border border-gray-100 rounded-lg p-3 shadow-sm text-sm text-gray-700 flex justify-between items-center">
            <span>Metformin 500mg</span>
            <button className="text-gray-400 hover:text-red-500">✕</button>
          </li>
        </ul>
      </div>
    </div>
  );
}