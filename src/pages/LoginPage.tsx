export default function LoginPage() {
  return (
    <div className="relative min-h-dvh">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/lockated/login-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-white/60" />

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-8">
        <div className="w-full max-w-[470px]">
          <div className="relative overflow-hidden rounded-[10px] bg-[rgba(40,57,101,0.7)] px-8 py-10 text-white shadow-2xl sm:px-14">
            <div className="flex justify-center">
              <img
                src="/lockated/login-logo.png"
                alt="Lockated"
                className="mb-5 h-auto w-[100px]"
              />
            </div>

            <form className="space-y-4" autoComplete="off">
              <div className="relative">
                <input
                  className="h-11 w-full rounded-full border border-white/10 bg-white px-6 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-amber-400"
                  placeholder="Email / Mobile"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="h-11 w-full rounded-full border border-white/10 bg-white px-6 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-amber-400"
                  placeholder="Password"
                  required
                />
              </div>

              <p className="pt-1 text-center text-[13px] font-medium leading-5 text-white">
                By clicking Log in you are accepting our{' '}
                <a
                  className="font-semibold text-[#b5c8f1] hover:text-[#f1b80e]"
                  href="https://www.lockated.com/cms/privacy_policy.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                &amp; agree to the{' '}
                <a
                  className="font-semibold text-[#b5c8f1] hover:text-[#f1b80e]"
                  href="https://www.lockated.com/cms/terms.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms &amp; Conditions.
                </a>
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  className="mx-auto block h-11 w-[65%] rounded-full bg-[#f1b80e] text-sm font-semibold uppercase text-slate-900 hover:brightness-95"
                >
                  login
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="https://lockated.com/password/recover"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-semibold text-white hover:text-[#f1b80e]"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center text-xs text-slate-600">
            <a href="/" className="font-semibold hover:text-slate-900">
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

