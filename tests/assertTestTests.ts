import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { AssertTest, MochaTestRunner } from "../sources";
import { AssertionError } from "assert";
import { PreConditionError } from "@everyonesoftware/base-typescript";

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
        });
    });
}
test(MochaTestRunner.create());