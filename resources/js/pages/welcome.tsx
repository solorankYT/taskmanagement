import PomodoroTimer from '@/components/PomodoroTimer';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] p-6 lg:p-10 flex flex-col justify-between">
        {/* Navigation */}
        {/* <header className="flex justify-end gap-4 max-w-7xl mx-auto w-full">
          {auth.user ? (
            <Link
              href={route('dashboard')}
              className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="rounded-md px-5 py-2 text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] hover:underline"
              >
                Log in
              </Link>
              <Link
                href={route('register')}
                className="rounded-md border px-5 py-2 text-sm font-medium border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Register
              </Link>
            </>
          )}
        </header> */}

        <main className="flex flex-col-reverse lg:flex-row max-w-7xl mx-auto w-full mt-10 lg:mt-20 gap-8">
          <div className="flex-1 bg-white dark:bg-[#161615] rounded-xl shadow-md p-6 lg:p-10">
            <PomodoroTimer />
          </div>

          {auth.user ? (
             <Link
              href={route('dashboard')}
              className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
            >
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <h1 className='text-2xl font-bold text-center'>
             Continue to your dashboard
            </h1>
            </div>
            </Link>
          ) : (
            <>
              <div className="w-full max-w-md lg:w-[440px] bg-[#fff2f2] dark:bg-[#1D0002] rounded-xl shadow-md p-6 lg:p-10 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Stay Focused with Pomodoro
                  </h2>
                  <p className="text-sm leading-relaxed text-[#444] dark:text-neutral-300">
                    The Pomodoro Timer helps you work in focused bursts (usually 25
                    minutes) with short breaks in between. It's perfect for avoiding
                    burnout and boosting productivity.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={route('register')}
                    className="bg-[#1b1b18] text-white dark:bg-white dark:text-[#1b1b18] font-medium py-2 px-4 rounded-md text-center hover:opacity-90 transition"
                  >
                    Sign up for more features
                  </Link>
                  <Link
                    href={route('login')}
                    className="text-sm text-center hover:underline"
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
        <footer className="hidden lg:block h-12" />
      </div>
    </>
  );
}
