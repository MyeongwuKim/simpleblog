import { fetchProfile } from "@/app/lib/fetchers/profile";
import { Profile } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProfileFormType = "profileimg" | "intro" | "social" | "content";
type ProfileMutationVariables = Partial<Profile> & { form: ProfileFormType };

export function useProfileQuery() {
  return useQuery<QueryResponse<Profile>>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function useProfileMutate({
  onSuccessCallback,
  onError,
}: {
  onSuccessCallback?: (data: QueryResponse<Profile>) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation<QueryResponse<Profile>, Error, ProfileMutationVariables>({
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
    onSuccess: (data) => {
      queryClient.setQueryData<QueryResponse<Profile>>(["profile"], (old) => {
        if (!old) return data; // 캐시 없으면 새 데이터 넣기
        return {
          ...old,
          data: { ...old.data, ...data.data }, // 이전값 + 새 값 머지
        };
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError,
  });
}
