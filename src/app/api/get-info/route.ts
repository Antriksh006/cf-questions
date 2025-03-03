import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json();
    let {startDate,endDate,handle} = body;
    if(!endDate){
        endDate = new Date().toISOString();
    }
    if(!startDate){
        startDate = new Date(0).toISOString();
    }
    const url = `https://codeforces.com/api/user.status?handle=${handle}`;
    const response = await axios.get(url);
    startDate = new Date(startDate).getTime();
    endDate = new Date(endDate).getTime();

    if (response.data.status !== "OK") {
        throw new Error("Invalid response from Codeforces API");
      }
    
    const submissions = response.data.result;
    const filteredSubmissions = submissions.filter((submission: any) => {
        const submissionTime = submission.creationTimeSeconds * 1000;
        return startDate <= submissionTime && submissionTime <= endDate;
      }
    );
    const problems = new Set();
    filteredSubmissions.forEach((submission: any) => {
        if(submission.verdict == "OK"){
        problems.add(submission.problem.name);}
        }
    );
    const incorrectProblems = new Set();
    filteredSubmissions.forEach((submission: any) => {
        if(submission.verdict !== "OK"){
        incorrectProblems.add(submission.problem.name);}
        }
    );
    const incorrectSubmissions = filteredSubmissions.filter((submission: any) => {
        return submission.verdict !== "OK";
    });
    return NextResponse.json({
        count: problems.size,
        problems: Array.from(problems),
        incorrectSubmissions: incorrectSubmissions.length,
        incorrectProblems: Array.from(incorrectProblems),
    });
}
