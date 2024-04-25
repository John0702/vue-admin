export default function dateTransform(val) {
  const date = new Date(val);
  // 将date转换成 yyyy-MM-dd HH:mm:ss格式
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const newTime = `${year}-${month}-${day} ${hour}:${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}`;
  return newTime;
}
