import { render, screen, fireEvent } from "@testing-library/react";
import DropdownProfile from "@/components/ui/dropdown/dropdownProfile";
import userEvent from "@testing-library/user-event";
import { getDeliveryDomain } from "@/app/hooks/useUtil";

jest.mock("next/image", () => (props: any) => {
  const { priority, fill, ...rest } = props;
  return <img {...rest} alt={props.alt} />;
});

const items = [
  { content: "글쓰기", value: "글쓰기" },
  { content: "설정", value: "설정" },
  { content: "임시글", value: "임시글" },
  { content: "로그아웃", value: "로그아웃" },
];

describe("DropdownProfile Test", () => {
  test("드롭다운을 클릭하면 옵션 목록이 렌더링된다", async () => {
    render(<DropdownProfile items={items} />);

    const triggerButton = screen.getByTestId("dropdown-trigger");
    await userEvent.click(triggerButton); // dropdown 열기
    for (let item of items) {
      expect(screen.getByText(item.content)).toBeInTheDocument();
    }
  });
  test("프로필 이미지 url을 확인한다.", async () => {
    render(<DropdownProfile items={items} profileImg={"testImg"} />);
    const img = screen.getByRole("img", { name: "profile" });

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", getDeliveryDomain("testImg", "thumbnail"));
  });
});
