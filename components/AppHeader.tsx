import Header from "./Header";
import LocaleSuggestBanner from "./LocaleSuggestBanner";

export default function AppHeader() {
  return (
    <>
      <LocaleSuggestBanner />
      <Header />
    </>
  );
}
