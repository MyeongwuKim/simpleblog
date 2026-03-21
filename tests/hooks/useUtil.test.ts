import {
  formateDate,
  formatRelativeTime,
  getDeliveryDomain,
  getFormatImagesId,
  getScrollValue,
  setScrollValue,
} from "@/app/hooks/useUtil";

describe("useUtil core helpers", () => {
  describe("getDeliveryDomain", () => {
    test("Cloudflare delivery URL을 생성한다", () => {
      const result = getDeliveryDomain("image-123", "avatar");
      expect(result).toBe(
        "https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/image-123/avatar"
      );
    });
  });

  describe("getFormatImagesId", () => {
    test("markdown 본문에서 public 이미지 id를 추출한다", () => {
      const id1 = "11111111-1111-1111-1111-111111111111";
      const id2 = "22222222-2222-2222-2222-222222222222";
      const content = [
        `![a](https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${id1}/public)`,
        "텍스트",
        `![b](https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${id2}/public)`,
      ].join("\n");

      expect(getFormatImagesId(content)).toEqual([id1, id2]);
    });

    test("public variant가 아니면 추출하지 않는다", () => {
      const content =
        "![a](https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/33333333-3333-3333-3333-333333333333/thumbnail)";

      expect(getFormatImagesId(content)).toEqual([]);
    });
  });

  describe("date formatting", () => {
    test("NOR 포맷 날짜를 반환한다", () => {
      const result = formateDate(new Date(2026, 2, 21, 12, 0, 0), "NOR");
      expect(result).toBe("2026.03.21");
    });

    test("US 포맷 날짜를 반환한다", () => {
      const result = formateDate(new Date(2026, 2, 21, 12, 0, 0), "US");
      expect(result).toContain("March 21, 2026");
      expect(result).toContain("SAT");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 21, 12, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("1분 미만은 방금 전을 반환한다", () => {
      expect(formatRelativeTime(new Date(2026, 2, 21, 11, 59, 40))).toBe("방금 전");
    });

    test("분/시간/일 단위를 반환한다", () => {
      expect(formatRelativeTime(new Date(2026, 2, 21, 11, 50, 0))).toBe("10분 전");
      expect(formatRelativeTime(new Date(2026, 2, 21, 10, 0, 0))).toBe("2시간 전");
      expect(formatRelativeTime(new Date(2026, 2, 18, 12, 0, 0))).toBe("3일 전");
    });

    test("7일 이상이면 NOR 날짜 포맷을 반환한다", () => {
      expect(formatRelativeTime(new Date(2026, 2, 1, 12, 0, 0))).toBe("2026.03.01");
    });
  });

  describe("scroll storage", () => {
    test("pathname 기준으로 scroll 값을 저장/조회한다", () => {
      setScrollValue("/post", "120");
      expect(getScrollValue("/post")).toBe(120);
    });

    test("저장된 값이 없으면 -1을 반환한다", () => {
      expect(getScrollValue("/does-not-exist")).toBe(-1);
    });
  });
});
