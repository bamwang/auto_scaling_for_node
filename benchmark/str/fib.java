public class fib {
    public static void main(final String[] args) {
        // System.out.println("指定された引数は、" + args.length + "個です");
        int n =1;
        try{
        	n = Integer.parseInt(args[0]);
        }catch(Exception e){
			System.out.println("aaaa" + n);
        }
        //int str = str(n);
		System.out.println(str(n));
    }
    public static int str(int n) {
		String str = "";
        String toBeAppended = "0";
        StringBuffer sb = new StringBuffer();
        sb.append(str);
        for (int i =0  ; i < n ; i++) {
            sb.append(toBeAppended);
        }
        str = sb.toString();
        return n;
	}
}