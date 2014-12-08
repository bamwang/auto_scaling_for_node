public class fib {
    public static void main(final String[] args) {
        // System.out.println("指定された引数は、" + args.length + "個です");
        int n =1;
        try{
        	n = Integer.parseInt(args[0]);
        }catch(Exception e){
			System.out.println("aaaa" + n);
        }
        int fib = fib(n);
		System.out.println(fib);
    }
    public static int fib(int n) {
		if (n < 2) {
			return 1;
		} else {
			return fib(n - 2) + fib(n - 1);
		}
	}
}