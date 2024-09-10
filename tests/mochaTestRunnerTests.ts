import { Test, TestRunner, TestSkip } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { MochaTestRunner } from "../sources";
import { Iterable, PreConditionError } from "@everyonesoftware/base-typescript";

export function test(runner: TestRunner): void
{
    runner.testFile("mochaTestRunner.ts", () =>
    {
        runner.testType(MochaTestRunner.name, () =>
        {
            runner.testFunction("skip(boolean|undefined,string|undefined", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip();
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertTrue(skip.getShouldSkip());
                    test.assertEqual("", skip.getMessage());
                });

                runner.test("with false shouldSkip", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip(false);
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertFalse(skip.getShouldSkip());
                    test.assertEqual("", skip.getMessage());
                });

                runner.test("with true shouldSkip", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip(true);
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertTrue(skip.getShouldSkip());
                    test.assertEqual("", skip.getMessage());
                });

                runner.test("with null message", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip(true, null!);
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertTrue(skip.getShouldSkip());
                    test.assertEqual("", skip.getMessage());
                });

                runner.test("with empty message", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip(true, "");
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertTrue(skip.getShouldSkip());
                    test.assertEqual("", skip.getMessage());
                });

                runner.test("with non-empty message", (test: Test) =>
                {
                    const testRunner: MochaTestRunner = MochaTestRunner.create();
                    const skip: TestSkip = testRunner.skip(true, "hello!");
                    test.assertNotUndefinedAndNotNull(skip);
                    test.assertTrue(skip.getShouldSkip());
                    test.assertEqual("hello!", skip.getMessage());
                });
            });

            runner.testFunction("andList(unknown[]|Iterable<unknown>)", () =>
            {
                function andListErrorTest(values: unknown[] | Iterable<unknown>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const testRunner: MochaTestRunner = MochaTestRunner.create();
                        test.assertThrows(() => testRunner.andList(values), expected);
                    });
                }

                andListErrorTest(undefined!, new PreConditionError(
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                andListErrorTest(null!, new PreConditionError(
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function andListTest(values: unknown[] | Iterable<unknown>, expected: string): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const testRunner: MochaTestRunner = MochaTestRunner.create();
                        test.assertEqual(testRunner.andList(values), expected);
                    });
                }

                andListTest([], "");
                andListTest(Iterable.create(), "");

                andListTest([1], "1");
                andListTest(Iterable.create([1]), "1");

                andListTest([1, false], "1 and false");
                andListTest(Iterable.create([1, false]), "1 and false");

                andListTest([1, false, "hello"], "1, false, and \"hello\"");
                andListTest(Iterable.create([1, false, "hello"]), "1, false, and \"hello\"");
            });

            runner.testFunction("toString(unknown)", () =>
            {
                function toStringTest(value: unknown, expected: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const testRunner: MochaTestRunner = MochaTestRunner.create();
                        test.assertEqual(testRunner.toString(value), expected);
                    });
                }

                toStringTest(undefined, "undefined");
                toStringTest(null, "null");
                toStringTest(5, "5");
                toStringTest(true, "true");
                toStringTest("abc", `"abc"`);
                toStringTest([1,2,"3"], `[1,2,"3"]`);
                // toStringTest(Iterable.create([1,2,"3"]), `[1,2,"3"]`);
                // toStringTest(List.create([1,2,"3"]), `[1,2,"3"]`);
            });
        });
    });
}
test(createTestRunner());