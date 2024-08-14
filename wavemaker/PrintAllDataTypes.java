package com.wavemaker;
//import java.util.*;
public class PrintAllDataTypes {
    short s = 32;
    long l = 25235235235L;

    boolean b = true;
    int a = 23;
    float f = 2.3f;
    char c = 'G';
    String string = "Girisha";
    public static void main(String []args) {
        PrintAllDataTypes obj = new PrintAllDataTypes();
        System.out.println(obj.s);
        System.out.println(obj.l);
        System.out.println(obj.b);
        System.out.println(obj.a);
        System.out.println(obj.f);
        System.out.println(obj.c);
        System.out.println(obj.string);
    }
}
