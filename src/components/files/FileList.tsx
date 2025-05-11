"use client";
import { useState } from "react";
import { FileAttachment } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Download, MoreHorizontal, Trash, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileListProps {
	files: FileAttachment[];
	onDelete?: (fileId: string) => void;
}

export default function FileList({ files, onDelete }: FileListProps) {
	const { toast } = useToast();
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

	const formatSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const getFileIcon = (fileType: string) => {
		if (fileType.startsWith("image/")) {
			return <Image className='h-4 w-4' />;
		}
		return <File className='h-4 w-4' />;
	};

	const handleDownload = (file: FileAttachment) => {
		toast({
			title: "Download started",
			description: `${file.name} will download shortly.`,
		});
		// In a real app, this would trigger the download of the file
	};

	const handleDelete = (fileId: string) => {
		toast({
			title: "File deleted",
			description: "The file has been deleted successfully.",
		});
		if (onDelete) onDelete(fileId);
	};

	if (files.length === 0) {
		return (
			<div className='text-center py-12 border rounded-lg'>
				<File className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
				<h3 className='text-lg font-medium mb-1'>No files uploaded yet</h3>
				<p className='text-muted-foreground'>Upload files to see them listed here</p>
			</div>
		);
	}

	return (
		<Table>
			<TableCaption>A list of uploaded files.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Upload Date</TableHead>
					<TableHead className='w-[100px]'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{files.map((file) => (
					<TableRow key={file.id}>
						<TableCell className='font-medium flex items-center gap-2'>
							{getFileIcon(file.type)}
							{file.name}
						</TableCell>
						<TableCell>{file.type.split("/")[1]?.toUpperCase() || file.type}</TableCell>
						<TableCell>{formatSize(file.size)}</TableCell>
						<TableCell>{format(file.createdAt, "MMM d, yyyy")}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon'>
										<MoreHorizontal className='h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem onClick={() => handleDownload(file)}>
										<Download className='h-4 w-4 mr-2' />
										Download
									</DropdownMenuItem>
									<DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(file.id)}>
										<Trash className='h-4 w-4 mr-2' />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
