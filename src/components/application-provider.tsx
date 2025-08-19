import { AuthProvider, FileManagerProvider } from "@/context/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ApplicationProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FileManagerProvider>
          {children}
        </FileManagerProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
