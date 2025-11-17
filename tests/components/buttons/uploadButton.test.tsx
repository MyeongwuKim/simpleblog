import { render, screen, fireEvent } from "@testing-library/react";
import UploadButton from "@/components/ui/buttons/uploadButton";

describe("UplaodButton Test", () => {
  test("이미지 업로드를 테스트한다.", () => {
    const fn = jest.fn();
    render(<UploadButton onSelect={fn} />);
    const fileInput = screen.getByTestId("file-input");
    // 가짜 파일 생성
    const file = new File(["hello"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // 콜백이 파일과 함께 호출되었는지 확인
    expect(fn).toHaveBeenCalledWith(file);
  });
  test("파일이 없을 때 null을 전달해야 한다", () => {
    const fn = jest.fn();
    render(<UploadButton onSelect={fn} />);

    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, { target: { files: [] } });

    expect(fn).toHaveBeenCalledWith(null);
  });
});
