package com.wavemaker;
import java.sql.SQLOutput;
import java.util.*;
public class RandomNumber {
    public static void main(String []args) {
        int RandomNum = (int) (Math.random() * 1001);
        while(true)
        {
            System.out.println("Enter...7675");
            Scanner sc = new Scanner(System.in);
            int n = sc.nextInt();

            if (n > RandomNum) {
                System.out.println("Random number is:" + RandomNum);
                System.out.println("Given number is greater than the random Number");
            } else if (n < RandomNum) {
                System.out.println("Random number is:" + RandomNum);
                System.out.println("Given number is less than the random Number");
            } else {
                System.out.println("Random number is:" + RandomNum);
                System.out.println("perfectly matched");
                break;
            }
        }
    }
}
