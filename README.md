# 리액트 성능 개선 하는 방법 정리

## 크롬 확장 프로그램 사용법

### 1. chrome 확장 프로그램 설치
<a href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ko" target="_blank"> 크롬 확장 프로그램 설치</a>  
<img width="300" alt="스크린샷 2023-03-14 오후 5 22 59" src="https://user-images.githubusercontent.com/82946898/224939585-9e090d8c-28de-4e11-90c6-f9e7462c5fd1.png">

### 2. 개발자 도구에서 components
<img width="300" alt="스크린샷 2023-03-14 오후 6 00 36" src="https://user-images.githubusercontent.com/82946898/224949349-783431b5-7945-4062-9165-9f21353b24f4.png">
톱니바퀴 클릭
<img width="300" alt="스크린샷 2023-03-14 오후 6 01 30" src="https://user-images.githubusercontent.com/82946898/224949565-be8592e3-2b5d-41c7-841e-aa831218b01c.png">
해당 부분을 체크해주면 렌더링 되는 부분을 표시해줍니다.

### 3. 개발자 도구에서 Profiler -> 녹화버튼 클릭
<img width="300" alt="스크린샷 2023-03-14 오후 5 27 42" src="https://user-images.githubusercontent.com/82946898/224940775-46dfd705-a093-43a2-86d3-387c97783361.png">

### 4. 이벤트 발생 후 녹화버튼 다시 클릭
<img width="300" alt="스크린샷 2023-03-14 오후 5 29 30" src="https://user-images.githubusercontent.com/82946898/224941244-4f21b93f-f319-45c8-991f-54dfd17ef58f.png">
속도 체크

## 성능 개선 확인을 위한 앱 제작

### 같은 기능을하는 컴포넌트 A, B 만들기


```JSX
//component A
const A = ({message, posts}) => {
  return (
    <div>
      <h1>A Components</h1>
      <p>{message}</p>
      <ul>
        {posts.map(post => {
          return (
            <li key={post.id}>
              <p>{post.title}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default A;
```

```JSX
//component B
import React from "react";

const Message =  ({message})=> {
  return <p>{message}</p>
}

const ListItem =({post}) =>{
  return (
    <li key={post.id}>
      <p>{post.title}</p>
    </li>
  )
}

const List = ({posts}) =>{
  console.log("list component rendering")
  return (
    <ul>
      {posts.map(post => (
        <ListItem key={post.id} post={post}/>
      ))}
    </ul>
  )
}

const B = ({message, posts}) => {
  return (
    <div>
      <h1>B Components</h1>
      <Message message={message}></Message>
      <List posts={posts}/>
    </div>
  )
}
export default B;
```
A컴포넌트는 하나의 컴포넌트로 제작  
B컴포넌트는 기능별로 쪼개서 제작

<img width="558" alt="스크린샷 2023-03-14 오후 5 45 28" src="https://user-images.githubusercontent.com/82946898/224945530-4603fc73-1e15-44a9-b2c9-c641205a0b8d.png">

**기능을 쪼갠 B컴포넌트의 속도가 더 느리다..?!**  
A 컴포넌트의 경우 바뀐 부분만 렌더링 해주지만 B컴포넌트는 바뀌지 않은 컴포넌트도 리렌더링 되어서 성능이 더 떨어집니다.


## 리액트 앱 개선 방안
###  1. React.memo()
* 컴포넌트의 props가 바뀌지 않았다면, 리렌더링을 방지하여, 컴포넌트의 리렌더링 성능 최적화를 해줄수 있는 React함수

* 컴포넌트가 React.memo()에 둘러 쌓여 있다면, React는 컴포넌트를 렌더링 하고 결과를 `메모이징(Memoizaing)` 함  
-> React는 컴포넌트를 리렌더링 하지 않고, 마지막으로 렌더링된 결과를 사용

* props의 갹체를 비교할 때 `얕은 비교(Shallow)`를 함

#### React.memo() Props 비교 방식 수정하기
두번쨰 매개변수로 비교함수를 넣어주면 됩니다.
```JSX
React.memo(Component, [compareFunction(prevProps,nextProps)]);

function compareFunction(prevProps, nextProps){
  return (
    prevProps.a === nextProps.a &&
    prevProps.b === nextProps.b
  );
}
```

#### React memo를 사용을 지양해야 하는 상황
* 렌더링 될 때 props가 다른 경우가 대부분인 컴포넌트를 생각해보면, `메모이제이션(Memoization)` 기법의 이점을 얻기가 힘듦
props가 자주 변하는 컴포넌트를 React.memo()로 래핑 할지라도, React는 두 가지 작업을 리렌더링 할 때 마다 수행함
1. 이전 props와 다음 props의 동등 비교를 위해 비교 함수를 수행
2. 비교 함수는 거의 항상 false를 반환할 것이기 때문에 react는 이전 렌더링 내용과 다음 렌더링 내용을 비교
비교함수의 결과는 대부분 false를 반환 하기에 props 비교는 불필요함

**React.memo()는 리렌더링을 막기위한 도구보다 성능 개선의 도구**

### 결론
React는 메모이징 된 컴포넌트의 리 렌더링을 피할 수 있지만, 렌더링을 막기 위해 메모이제이션에 너무 의존하면 안됨(버그 유발 가능성이 있음)
React.memo 사용은 항상 좋은 것은 아니기에 profiler를 이용해서 성능상 이점이 있는지 확인 후 사용하면 좋음






