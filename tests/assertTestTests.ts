import { isNumber, isString, PreConditionError } from "@everyonesoftware/base-typescript";
import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { AssertTest } from "../sources";
import { createTestRunner } from "./tests";
import { AssertionError } from "assert";

export function test(runner: TestRunner): void
{
    runner.testFile("assertTest.ts", () =>
    {
        runner.testType(AssertTest.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const assertTest: AssertTest = AssertTest.create();
                test.assertNotUndefinedAndNotNull(assertTest);
            });

            runner.testFunction("fail(string)", () =>
            {
                function failTest(message: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(message)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.fail(message),
                            expected);
                    });
                }

                failTest(undefined!, new PreConditionError(
                    "Expression: message",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                failTest(null!, new PreConditionError(
                    "Expression: message",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                failTest("", new PreConditionError(
                    "Expression: message",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
                failTest("hello", new AssertionError({
                    message: "hello",
                    operator: "fail",
                }));
            });

            runner.testFunction("assertUndefined(unknown)", () =>
            {
                function assertUndefinedErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertUndefined(value), expected);
                    });
                }

                assertUndefinedErrorTest(null, new AssertionError({
                    actual: null,
                    operator: "strictEqual",
                }));
                assertUndefinedErrorTest(500, new AssertionError({
                    actual: 500,
                    operator: "strictEqual",
                }));

                function assertUndefinedTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertUndefined(value);
                    });
                }

                assertUndefinedTest(undefined);
            });

            runner.testFunction("assertNotUndefined(unknown)", () =>
            {
                function assertNotUndefinedErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertNotUndefined(value), expected);
                    });
                }

                assertNotUndefinedErrorTest(undefined, new AssertionError({
                    operator: "notStrictEqual",
                }));

                function assertNotUndefinedTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertNotUndefined(value);
                    });
                }

                assertNotUndefinedTest(null);
                assertNotUndefinedTest("");
                assertNotUndefinedTest(500);
            });

            runner.testFunction("assertNull(unknown)", () =>
            {
                function assertNullErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertNull(value), expected);
                    });
                }

                assertNullErrorTest(undefined, new AssertionError({
                    expected: null,
                    operator: "strictEqual",
                }));
                assertNullErrorTest("", new AssertionError({
                    expected: null,
                    actual: "",
                    operator: "strictEqual",
                }));
                assertNullErrorTest(500, new AssertionError({
                    expected: null,
                    actual: 500,
                    operator: "strictEqual",
                }));

                function assertNullTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertNull(value);
                    });
                }

                assertNullTest(null);
            });

            runner.testFunction("assertNotNull(unknown)", () =>
            {
                function assertNotNullErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertNotNull(value), expected);
                    });
                }

                assertNotNullErrorTest(null, new AssertionError({
                    actual: null,
                    expected: null,
                    operator: "notStrictEqual",
                }));

                function assertNotNullTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertNotNull(value);
                    });
                }

                assertNotNullTest(undefined);
                assertNotNullTest("");
                assertNotNullTest(500);
            });

            runner.testFunction("assertNotUndefinedAndNotNull(unknown)", () =>
            {
                function assertNotUndefinedAndNotNullErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertNotUndefinedAndNotNull(value), expected);
                    });
                }

                assertNotUndefinedAndNotNullErrorTest(undefined, new AssertionError({
                    actual: undefined,
                    operator: "notStrictEqual",
                }));
                assertNotUndefinedAndNotNullErrorTest(null, new AssertionError({
                    actual: null,
                    expected: null,
                    operator: "notStrictEqual",
                }));

                function assertNotUndefinedAndNotNullTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertNotUndefinedAndNotNull(value);
                    });
                }

                assertNotUndefinedAndNotNullTest("");
                assertNotUndefinedAndNotNullTest(500);
            });

            runner.testFunction("assertSame<T>(T,T)", () =>
            {
                function assertSameErrorTest<T>(left: T, right: T, expected: Error): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertSame(left, right), expected);
                    });
                }

                assertSameErrorTest(undefined, null, new AssertionError({
                    actual: undefined,
                    expected: null,
                    operator: "strictEqual",
                }));
                assertSameErrorTest(undefined, 5, new AssertionError({
                    actual: undefined,
                    expected: 5,
                    operator: "strictEqual",
                }));
                assertSameErrorTest(undefined, "hello", new AssertionError({
                    actual: undefined,
                    expected: "hello",
                    operator: "strictEqual",
                }));
                
                assertSameErrorTest(null, undefined, new AssertionError({
                    actual: null,
                    expected: undefined,
                    operator: "strictEqual",
                }));
                assertSameErrorTest(null, 5, new AssertionError({
                    actual: null,
                    expected: 5,
                    operator: "strictEqual",
                }));
                assertSameErrorTest(null, "hello", new AssertionError({
                    actual: null,
                    expected: "hello",
                    operator: "strictEqual",
                }));
                
                assertSameErrorTest(new String("hello"), new String("hello"), new AssertionError({
                    actual: new String("hello"),
                    expected: new String("hello"),
                    operator: "strictEqual",
                }));

                assertSameErrorTest({}, {}, new AssertionError({
                    actual: {},
                    expected: {},
                    operator: "strictEqual",
                }));

                function assertSameTest<T>(left: T, right: T): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (_: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertSame(left, right);
                    });
                }

                assertSameTest(undefined, undefined);
                assertSameTest(null, null);
                assertSameTest(false, false);
                assertSameTest(true, true);
                assertSameTest(51, 51);
                assertSameTest("abc", "abc");
            });

            runner.testFunction("assertNotSame<T>(T,T)", () =>
            {
                function assertNotSameErrorTest<T>(left: T, right: T, expected: Error): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        test.assertThrows(() => assertTest.assertNotSame(left, right), expected);
                    });
                }

                assertNotSameErrorTest(undefined, undefined, new AssertionError({
                    actual: undefined,
                    expected: undefined,
                    operator: "notStrictEqual",
                }));
                assertNotSameErrorTest(null, null, new AssertionError({
                    actual: null,
                    expected: null,
                    operator: "notStrictEqual",
                }));
                assertNotSameErrorTest(false, false, new AssertionError({
                    actual: false,
                    expected: false,
                    operator: "notStrictEqual",
                }));
                assertNotSameErrorTest(true, true, new AssertionError({
                    actual: true,
                    expected: true,
                    operator: "notStrictEqual",
                }));
                assertNotSameErrorTest(51, 51, new AssertionError({
                    actual: 51,
                    expected: 51,
                    operator: "notStrictEqual",
                }));
                assertNotSameErrorTest("abc", "abc", new AssertionError({
                    actual: "abc",
                    expected: "abc",
                    operator: "notStrictEqual",
                }));

                function assertNotSameTest<T>(left: T, right: T): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (_: Test) =>
                    {
                        const assertTest: AssertTest = AssertTest.create();
                        assertTest.assertNotSame(left, right);
                    });
                }

                assertNotSameTest(undefined, null);
                assertNotSameTest(undefined, 5);
                assertNotSameTest(undefined, "hello");
                assertNotSameTest(null, undefined);
                assertNotSameTest(null, 5);
                assertNotSameTest(null, "hello");
                assertNotSameTest(new String("hello"), new String("hello"));
                assertNotSameTest({}, {});
            });

            runner.testFunction("assertInstanceOf<T>(unknown,Type<T>,undefined|((value: unknown) => value is T))", () =>
            {
                runner.test("with undefined type", (test: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => assertTest.assertInstanceOf(50, undefined!),
                        new PreConditionError(
                            "Expression: type",
                            "Expected: not undefined and not null",
                            "Actual: undefined",
                        ),
                    );
                });

                runner.test("with null type", (test: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => assertTest.assertInstanceOf(50, null!),
                        new PreConditionError(
                            "Expression: type",
                            "Expected: not undefined and not null",
                            "Actual: null",
                        ),
                    );
                });

                runner.test("with non-matching string type and type check function", (test: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => assertTest.assertInstanceOf(true, String, isString),
                        new AssertionError({
                            operator: "fail",
                            message: "Expected value to be of type String but found true instead.",
                        }),
                    );
                });

                runner.test("with non-matching number type and type check function", (test: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => assertTest.assertInstanceOf(false, Number, isNumber),
                        new AssertionError({
                            operator: "fail",
                            message: "Expected value to be of type Number but found false instead.",
                        }),
                    );
                });

                runner.test("with non-matching AssertTest type and no type check function", (test: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => assertTest.assertInstanceOf("hello", AssertTest),
                        new AssertionError({
                            operator: "fail",
                            message: "Expected value to be of type AssertTest but found hello instead.",
                        }),
                    );
                });

                runner.test("with matching string type and type check function", (_: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    assertTest.assertInstanceOf("hello", String, isString);
                });

                runner.test("with matching number type and type check function", (_: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    assertTest.assertInstanceOf(50, Number, isNumber);
                });

                runner.test("with matching AssertTest type and no type check function", (_: Test) =>
                {
                    const assertTest: AssertTest = AssertTest.create();
                    assertTest.assertInstanceOf(assertTest, AssertTest);
                });
            });
        });
    });
}
test(createTestRunner());