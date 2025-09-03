import { fetchProfile } from "@/app/lib/fetchers/profile";
import { Profile } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProfileFormType = "profileimg" | "intro" | "social" | "content";
export type ProfileMutationVariables = Partial<Profile> & {
  form: ProfileFormType;
};

export function useProfileQuery() {
  return useQuery<QueryResponse<Profile>>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
type Ctx = { prev: QueryResponse<Profile> | undefined };

export function useProfileMutate({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: (data: QueryResponse<Profile>) => void;
  onErrorCallback?: (error: Error) => void;
}) {
  const qc = useQueryClient();
  return useMutation<
    QueryResponse<Profile>,
    Error,
    ProfileMutationVariables,
    Ctx
  >({
    mutationFn: async (data) => {
      const result = await (
        await fetch(`/api/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // ✅ data 전달
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    // ✅ 낙관적 업데이트
    onMutate: async (vars) => {
      // 1) 진행 중인 요청 중단
      await qc.cancelQueries({ queryKey: ["profile"] });

      // 2) 이전 스냅샷 저장 (롤백용)
      const prev = qc.getQueryData<QueryResponse<Profile>>(["profile"]);

      // 3) 캐시에 즉시 반영 (vars.form에 따라 필요한 필드만 머지)
      qc.setQueryData<QueryResponse<Profile>>(["profile"], (old) => {
        const base: QueryResponse<Profile> = old ?? {
          ok: true,
          error: "",
          data: {} as Profile,
        };

        const next: Profile = { ...base.data };

        switch (vars.form) {
          case "content":
            if (vars.content !== undefined) next.content = vars.content;
            break;
          case "intro":
            if (vars.introduce !== undefined) next.introduce = vars.introduce;
            break;
          case "profileimg":
            if (vars.profileImg !== undefined)
              next.profileImg = vars.profileImg;
            break;
          case "social":
            if (vars.github !== undefined) next.github = vars.github;
            if (vars.notion !== undefined) next.notion = vars.notion;
            if (vars.instagram !== undefined) next.instagram = vars.instagram;
            break;
        }

        return { ...base, data: next };
      });

      // 4) 컨텍스트 반환 (onError에서 롤백)
      return { prev };
    },
    onSuccess: (data) => {
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["profile"], ctx.prev);
      if (onErrorCallback) onErrorCallback(err);
    },
  });
}
