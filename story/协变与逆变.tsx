interface Animal {
    birth: string   // 生育
}

interface Dog extends Animal {
    bark: string    // 汪汪叫
}

interface MadDog extends Dog {
    attack: string  // 咬人
}

let animal: Animal = {} as any
let dog: Dog = {} as any
let madDog: MadDog = {} as any

let fun: (cb: ((cbDog: Dog) => Dog)) => void = {} as any

/* 一、MadDog->MadDog */
// let cb1: (cb1Dog: MadDog) => MadDog = {} as any
// fun(cb1)                                                   // ×，在fun1中调用cb时，参数是dog，但是cb1函数的参数要求是MadDog；

/* 二、MadDog->Animal */
// let cb2: (cbsDog: MadDog) => Animal = {} as any
// fun(cb2)                                                    // 原因同第一个

/* 三、 Animal->Animal */
// let cb3: (cb3Dog: Animal) => Animal = {} as any
// fun(cb3)                                                    // 在func中执行完cb3之后，可能会需要调用Dog的bark方法，但是cb3返回的是Animal，可能没有bark属性。

/*  四、Animal->MadDog */
let cb4: (cb4Dog: Animal) => MadDog = {} as any             // 是类型安全的，在调用cb4的时候，Dog类型一定符合Animal。返回的MadDog类型一定符合Dog
fun(cb4)

/* 结论 */
/*
(Animal->MadDog) << (Dog->Dog)
左边是右边的子类（返回值：子类的返回值是父类返回值的子类。但是参数是相反的，子类的参数应该是父类参数的父类）

返回值类型是协变的，意思是 A<<B，那么 T->A << T->B
参数是逆变的，意思是 A<<B, 那么 A->R >> B->R

*/






