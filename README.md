# Project : MOTION

---

##### skill & tools :

- Backend : NextJS, Planet Scale(DB), Prisma(ORM), Vercel(deploy), iron-session, CloudFlare
- Frontend : NextJS, react-hook-form, tailwind,SWR

\*\* features

- 인증(로그인)
  ✓ 인증을 완료해야만 글을 게시할 수 있습니다. 그렇지 않으면 게시된 글을 확인만 할 수 있습니다.

  1. 쉽고 간편하게 접근할 수 있도록 유저네임과 이메일을 사용하여 로그인 할 수 있습니다.
  2. 로그인 하기 위해서, 유저네임과 이메일을 입력하면 토큰 숫자가 나타납니다.
     (임시로 폼 위쪽에 나탄게 됩니다.)
  3. 토큰 인증이 완료가 된다면 홈페이지로 전환됩니다.

  - 특징
    ✓ withHandler()함수를 만들어 Next Handler를 감싸고, 로그인되지 않은 유저 또는 잘못된 request의 접근을 보호할 수 있습니다.

- 유저

  1. 게시글을 게시한 특정 유저의 프로필을 볼 수 있습니다.
  2. 유저 프로필에서 유자가 게시한 모든 게시글을 볼 수 있습니다.
  3. editProfile페이지에서 유저의 프로필을 변경할 수 있습니다.

  - 특징
    ✓ email, username을 중복되지 않게 변경이 가능합니다.
    ✓ <span style="color:red"><u>(수정)</u></span> 아바타 변경 시 미리보기가 가능하며,
