import { render, screen, fireEvent } from "@testing-library/react";
import TabButtons from "@/components/ui/buttons/TabButtons";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/", // 시작 라우트: /
}));

describe("TabButtons Test", () => {
  test("프로필 탭 클릭 시 '/profile' 로 이동한다", () => {
    render(<TabButtons />);

    const span = screen.getByText("프로필");
    const button = span.closest("button");

    fireEvent.click(button!);

    expect(pushMock).toHaveBeenCalledWith("/profile");
  });
});
