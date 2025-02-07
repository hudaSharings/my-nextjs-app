export async function forgotPassword(data:{email:string}) {

    try {
       // const { email,} = data;   
        console.log("Signup Data:", data);
        return { success: true };
      } catch (error) {
        return { errors: { email: "Error message" } };
      }   
}