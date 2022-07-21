/* eslint-disable prettier/prettier */

export enum MessageSuccessfullyI {
    CREATE = "Create successfully: ",
    UPDATE = "Update successfully: ",
    DELETE = "Delete successfully: ",
    GET = "Get information successfully: ",
    CONFIRM = "Confirm successfully: ",
    GET_MANY_PROJECTS = "Get many projects successfully: ",
    GET_MANY_TASKS = "Get many tasks successfully: ",
    GET_DETAIL = "Get detail successfully: ",
    ADD_MEMBER = "Add member successfully: ",
    DELETE_MEMBER = "Delete member successfully: ",
    GET_MANY_MEMBERS = "Get all members successfully: ",
    SEND_MAIL = "Send mail successfully. Please check your mail.",
    MAIL_BUG = "There is a bug that needs you to fix soon",
    VERIFY_TOKEN = "Verify the validity of the email address. Please do not share the code to avoid information leakage: ",
    LOGIN = "Login successfully",
    REGISTER = "Register successfully",
    RESET_PASSWORD = "Reset password successfully",
    CHANGE_PASSWORD = "Change password successfully",
    CONFIRM_ACCOUNT = "Confirm account successfully",
    GET_MANY_USER = "Get many user successfully",
    GIVE_PERMISSIONS = "Give permission user successfully"
}

export enum MessageFailedI {
    CREATE = "Create failed: ",
    UPDATE = "Update failed: ",
    DELETE = "Delete failed: ",
    GET = "Get information failed: ",
    CONFIRM = "Confirm failed: ",
    GET_MANY_PROJECTS = "Get many projects failed: ",
    GET_MANY_TASKS = "Get many tasks failed: ",
    GET_DETAIL = "Get detail failed: ",
    ADD_MEMBER = "Add member failed: ",
    DELETE_MEMBER = "Delete member failed: ",
    GET_MANY_MEMBERS = "Get all members failed: ",
    SEND_MAIL = "Send mail failed !. Please check information",
    LOGIN = "Login failed",
    REGISTER = "Register failed",
    RESET_PASSWORD = "Reset password failed",
    CHANGE_PASSWORD = "Change password failed",
    GET_MANY_USER = "Get many user failed",
    GIVE_PERMISSIONS = "Give permission user failed",
    NOT_FOUND = "Not found: ",
    EMAIL_EXIST = "Email or name already exists",
    UNAUTHOR = "Please check your login credentials or confirm email"
}