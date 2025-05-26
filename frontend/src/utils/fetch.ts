export async function authFetch(url: string, options: RequestInit = {}): Promise<Response | void> {
  // 排除 login 接口
  if (!url.includes("/login")) {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // 如果 body 是对象（非 FormData），则自动转为 JSON
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    options.headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, options);

  // 自动处理 401 未授权
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  return res;
}
