<%
int n;
try{
  n = Integer.parseInt( request.getParameter("n") );
}catch(Exception e){
  n=1;
}
%>
<%!
int fib(int n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}
%>
<%
out.println(fib(n));
%>
