// Every page that calls the API needs to turn a failed request into a
// message it can show the user. Centralizing that here means the
// three-way fallback (backend message → generic text → doesn't crash
// on a network error with no `response` at all) is written once
// instead of copy-pasted across 16 different pages.
function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || fallback;
}

export default getErrorMessage;
