import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa'
import { HighlightText } from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import ExploreMore from '../components/core/HomePage/ExploreMore'





const Home = () => {
  return (
    <div>
    <div className='max-w-maxContent relative mx-auto flex flex-col w-11/12 items-center 
    text-white justify-between '>
        {/* section 1 */}
        <Link to={"/signup"}>
        <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
          transition-all duration-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                <p>Become a Instructor</p>
                <FaArrowRight></FaArrowRight>
            </div>
        </div>
        </Link>

        <div className='mt-7 text-center text-4xl font-semibold'>
          Empower Your Future With <HighlightText text={"Coding Skills"}/>
        </div>

        <div className='w-[90%] text-center text-lg font-bold text-richblack-300 mt-4 '>
        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>

            <CTAButton active={true} linkto={'/signup'}>Lean More</CTAButton>

            <CTAButton active={false} linkto={'/login'}>Book a Demo</CTAButton>

        </div>

        <div className='mx-3 my-12 shadow-[10px_-5px_50px_-5px]  shadow-blue-200 '>
            <video
               className='shadow-[20px_20px_rgba(255,255,255)]'
                muted
                loop
                autoPlay
                >

                <source src={Banner} type='video/mp4'></source>

            </video>
        </div>

        {/* code section 1 */}

        <div>
           <CodeBlocks 

           position={"lg:flex-row"}

           heading={
            <div className='text-4xl font-semibold'>
              Unlock Your <HighlightText
              text={"coding potential "}
              />
              with our online course

             
            </div>
           }

           subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
            
           ctabtn1={
            {
              text:"try it yourself",
              linkto:"/signup",
              active:true,
            }
           }

           ctabtn2={
            {
              text:"learn more",
              linkto:"/login",
              active:false,
            }
           }

           codeColor={"text-yellow-25"}
           codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
           backgroundGradient={<div className="codeblock1 absolute"></div>}


            

           
           
           >

           </CodeBlocks>

            {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              text: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              text: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>



        </div>

        <ExploreMore/>

        


        



    </div>

        {/* section 2 */}

        {/* section 3 */}

        {/* footer */}
    
    </div>
  )
}

export default Home