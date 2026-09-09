const base = "http://localhost:8000";

function parseSetCookie(header) {
  if (!header) return "";
  const cookies = header
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const parsed = [];
  for (const cookie of cookies) {
    const firstSemicolon = cookie.indexOf(";");
    parsed.push(
      cookie.slice(0, firstSemicolon === -1 ? cookie.length : firstSemicolon),
    );
  }
  return parsed.join("; ");
}

async function main() {
  const loginRes = await fetch(`${base}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "autotest20260909192619@example.com",
      password: "Pass123!",
    }),
  });

  const loginText = await loginRes.text();
  console.log("LOGIN_STATUS", loginRes.status);
  console.log(loginText);

  const cookieHeader = parseSetCookie(loginRes.headers.get("set-cookie"));
  console.log("COOKIE_HEADER", cookieHeader);

  const currentUserRes = await fetch(`${base}/api/v1/auth/current-user`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  const currentUserText = await currentUserRes.text();
  console.log("CURRENT_USER_STATUS", currentUserRes.status);
  console.log(currentUserText);

  const refreshRes = await fetch(`${base}/api/v1/auth/refresh-token`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  const refreshText = await refreshRes.text();
  console.log("REFRESH_STATUS", refreshRes.status);
  console.log(refreshText);

  const logoutRes = await fetch(`${base}/api/v1/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  const logoutText = await logoutRes.text();
  console.log("LOGOUT_STATUS", logoutRes.status);
  console.log(logoutText);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
