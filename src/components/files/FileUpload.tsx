"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
	onFileUpload: (file: File) => void;
	accept?: string;
	maxSize?: number; // in MB
}

export default function FileUpload({
	onFileUpload,
	accept = "image/*, .pdf, .doc, .docx, .xls, .xlsx, .txt",
	maxSize = 10, // 10MB default
}: FileUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const validateFile = (file: File): string | null => {
		// Check file size
		if (file.size > maxSize * 1024 * 1024) {
			return `File size exceeds ${maxSize}MB limit.`;
		}

		// Check file type based on accept prop
		if (accept !== "*") {
			const acceptedTypes = accept.split(",").map((type) => type.trim());
			const fileType = file.type;
			const extension = `.${file.name.split(".").pop()}`;

			const isAccepted = acceptedTypes.some((type) => {
				if (type.startsWith(".")) {
					// Check extension
					return extension.toLowerCase() === type.toLowerCase();
				} else if (type.endsWith("/*")) {
					// Check MIME type category
					const category = type.slice(0, -2);
					return fileType.startsWith(category);
				} else {
					// Check exact MIME type
					return fileType === type;
				}
			});

			if (!isAccepted) {
				return "File type not supported.";
			}
		}

		return null;
	};

	const processFile = (file: File) => {
		const error = validateFile(file);

		if (error) {
			toast({
				title: "Upload failed",
				description: error,
				variant: "destructive",
			});
			return;
		}

		setSelectedFile(file);

		// Simulate upload progress
		setIsUploading(true);
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 15;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				onFileUpload(file);
				setIsUploading(false);
				toast({
					title: "Upload complete",
					description: `${file.name} has been uploaded.`,
				});
			}
			setUploadProgress(progress);
		}, 300);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			processFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			processFile(e.target.files[0]);
		}
	};

	const handleCancel = () => {
		setSelectedFile(null);
		setUploadProgress(0);
		setIsUploading(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const getFileIcon = (fileName: string) => {
		const extension = fileName.split(".").pop()?.toLowerCase();

		switch (extension) {
			case "pdf":
				return <File className='h-8 w-8 text-red-500' />;
			case "doc":
			case "docx":
				return <File className='h-8 w-8 text-blue-500' />;
			case "xls":
			case "xlsx":
				return <File className='h-8 w-8 text-green-500' />;
			case "txt":
				return <File className='h-8 w-8 text-gray-500' />;
			case "jpg":
			case "jpeg":
			case "png":
			case "gif":
			case "webp":
				return <File className='h-8 w-8 text-purple-500' />;
			default:
				return <File className='h-8 w-8 text-gray-500' />;
		}
	};

	return (
		<div className='space-y-4'>
			{selectedFile ? (
				<div className='border rounded-lg p-4'>
					<div className='flex items-center justify-between mb-2'>
						<div className='flex items-center space-x-3'>
							{getFileIcon(selectedFile.name)}
							<div>
								<p className='font-medium truncate max-w-[200px]'>{selectedFile.name}</p>
								<p className='text-sm text-muted-foreground'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
							</div>
						</div>
						<Button variant='ghost' size='icon' onClick={handleCancel} disabled={isUploading}>
							<X className='h-4 w-4' />
						</Button>
					</div>

					{isUploading && (
						<div className='space-y-1'>
							<Progress value={uploadProgress} className='h-1' />
							<p className='text-xs text-right text-muted-foreground'>{Math.round(uploadProgress)}%</p>
						</div>
					)}
				</div>
			) : (
				<div
					className={cn("border-2 border-dashed rounded-lg p-8 text-center", isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20")}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}>
					<div className='flex flex-col items-center justify-center space-y-4'>
						<div className='rounded-full bg-muted p-3'>
							<Upload className='h-6 w-6 text-muted-foreground' />
						</div>
						<div className='space-y-1'>
							<p className='font-medium'>Drag & drop a file here</p>
							<p className='text-sm text-muted-foreground'>or click to browse files (max {maxSize}MB)</p>
						</div>
						<Button variant='secondary' onClick={() => fileInputRef.current?.click()}>
							Select file
						</Button>
						<input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} accept={accept} />
					</div>
				</div>
			)}
		</div>
	);
}
