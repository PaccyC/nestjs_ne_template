

class ApiResponse {
    success: boolean
    message: string
    data: any
    status: number

    constructor(success: boolean, message: string, data: any,status: number) {
        this.success = success
        this.message = message
        this.data = data
        this.status= status
    }

    static success(message: string,status: number , data?: any | null ) {
        return new ApiResponse(true, message, data,status)
    }

    static error(message: string, status:number, data?: any | null) {
        return new ApiResponse(false, message, data,status)
    }

}

export default ApiResponse