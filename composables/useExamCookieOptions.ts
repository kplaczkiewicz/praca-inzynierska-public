// Return default exam cookie options

export default function useExamCookieOptions() {
    return {
        sameSite: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // a week
    }
}