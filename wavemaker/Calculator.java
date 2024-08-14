package com.wavemaker;
import java.math.BigInteger;
import java.util.Scanner;

class Calculator {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Enter num1:");
        BigInteger num1 = new BigInteger(scanner.nextLine());

        System.out.println("Enter num2:");
        BigInteger num2 = new BigInteger(scanner.nextLine());

        System.out.println("Choose an operation (+, -, *, /, %):");
        char ch = scanner.next().charAt(0);

        BigInteger result = BigInteger.ZERO;

        switch (ch) {
            case '+':
                result = num1.add(num2);
                break;
            case '-':
                result = num1.subtract(num2);
                break;
            case '*':
                result = num1.multiply(num2);
                break;
            case '/':
                if (!num2.equals(BigInteger.ZERO)) {
                    result = num1.divide(num2);
                } else {
                    System.out.println("Division by zero is not allowed.");
                    return;
                }
                break;
            case '%':
                if (!num2.equals(BigInteger.ZERO)) {
                    result = num1.remainder(num2);
                } else {
                    System.out.println("Division by zero is not allowed.");
                    return;
                }
                break;
            default:
                System.out.println("Invalid operation.");
                return;
        }

        System.out.println("The result is: " + result);
    }
}

